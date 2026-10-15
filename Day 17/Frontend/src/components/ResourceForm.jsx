import { useEffect, useState } from "react";

const initialValues = (fields, data) =>
  fields.reduce((acc, f) => {
    let v = data?.[f.name];
    if (f.type === "list") v = Array.isArray(v) ? v.join(", ") : v ?? "";
    else if (f.type === "checkbox") v = v ?? f.default ?? false;
    else v = v ?? f.default ?? "";
    return { ...acc, [f.name]: v };
  }, {});

export default function ResourceForm({
  label, fields, createFn, updateFn, mode = "create", initialData, onSuccess, onCancel,
}) {
  const [values, setValues] = useState(() => initialValues(fields, initialData));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // edit form ko existing data se bharo
  useEffect(() => {
    if (mode === "edit" && initialData) setValues(initialValues(fields, initialData));
  }, [mode, initialData]); // eslint-disable-line

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    fields.forEach((f) => {
      const v = values[f.name];
      const empty = v === "" || v == null || (typeof v === "string" && !v.trim());
      if (f.required && empty) e[f.name] = `${f.label} is required`;
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) e[f.name] = "Invalid email address";
      else if (f.type === "number" && v !== "" && Number(v) < 0) e[f.name] = "Cannot be negative";
    });
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setError("");
    try {
      const payload = { ...values };
      fields.forEach((f) => {
        if (f.type === "number") payload[f.name] = values[f.name] === "" ? undefined : Number(values[f.name]);
      });
      const res = mode === "edit" ? await updateFn(initialData._id, payload) : await createFn(payload);
      onSuccess(res.data);
      if (mode === "create") setValues(initialValues(fields, null));
    } catch (err) {
      setError(err.message);
      if (err.fieldErrors) setErrors(err.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (f) => {
    const common = { name: f.name, value: values[f.name], onChange: handleChange };
    let input;
    if (f.type === "select") {
      input = <select {...common}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>;
    } else if (f.type === "textarea") {
      input = <textarea rows={3} {...common} style={{ width: "100%" }} />;
    } else if (f.type === "checkbox") {
      return (
        <label key={f.name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input type="checkbox" name={f.name} checked={values[f.name]} onChange={handleChange} style={{ width: "auto", margin: 0 }} />
          {f.label}
        </label>
      );
    } else {
      input = <input type={f.type === "list" ? "text" : f.type || "text"} placeholder={f.placeholder} {...common} />;
    }
    return (
      <label key={f.name} style={{ marginBottom: 12, display: "block" }}>
        {f.label}{f.required && " *"}
        {input}
        {errors[f.name] && <small style={{ color: "red" }}>{errors[f.name]}</small>}
      </label>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{mode === "edit" ? `Edit ${label}` : `Create ${label}`}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0 16px" }}>
        {fields.map(renderField)}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button type="submit" disabled={submitting}>
          {submitting ? (mode === "edit" ? "Saving changes..." : `Creating ${label.toLowerCase()}...`) : mode === "edit" ? "Save Changes" : `Create ${label}`}
        </button>
        {onCancel && <button type="button" onClick={onCancel} disabled={submitting}>Cancel</button>}
      </div>
    </form>
  );
}