// Runs WITHOUT MongoDB: checks input validation, auth guards and error handling. Usage: npm run test:validation
process.env.JWT_SECRET='test'; process.env.NODE_ENV='test';
const app=require('../app');
const srv=app.listen(0, async()=>{
  const base=`http://localhost:${srv.address().port}/api`;
  const call=async(p,o={})=>{const r=await fetch(base+p,{...o,headers:{'Content-Type':'application/json',...(o.headers||{})}});return [r.status,await r.json().catch(()=>({}))]};
  const J=(b)=>({method:'POST',body:JSON.stringify(b)});
  const T=[
   ['health 200',()=>call('/health'),200],
   ['register missing fields 400',()=>call('/auth/register',J({email:'a@b.co'})),400],
   ['register bad email 400',()=>call('/auth/register',J({name:'A',email:'bad',password:'secret1',phone:'9876543210'})),400],
   ['register short pw 400',()=>call('/auth/register',J({name:'A',email:'a@b.co',password:'123',phone:'9876543210'})),400],
   ['register bad phone 400',()=>call('/auth/register',J({name:'A',email:'a@b.co',password:'secret1',phone:'12'})),400],
   ['login missing 400',()=>call('/auth/login',J({})),400],
   ['malformed JSON 400',()=>call('/auth/login',{method:'POST',body:'{bad'}),400],
   ['bad sort 400',()=>call('/products?sort=zzz'),400],
   ['bad minPrice 400',()=>call('/products?minPrice=abc'),400],
   ['min>max 400',()=>call('/products?minPrice=500&maxPrice=100'),400],
   ['bad rating 400',()=>call('/products?minRating=9'),400],
   ['bad limit 400',()=>call('/products?limit=0'),400],
   ['invalid product id 400',()=>call('/products/123'),400],
   ['invalid order id 400',()=>call('/orders/xyz'),400],
   ['invalid category id 400',()=>call('/categories/xyz',{method:'PATCH',body:'{}'}),400],
   ['orders no token 401',()=>call('/orders'),401],
   ['orders bad token 401',()=>call('/orders',{headers:{Authorization:'Bearer bad'}}),401],
   ['me no token 401',()=>call('/auth/me'),401],
   ['product create no token 401',()=>call('/products',J({name:'x'})),401],
   ['unknown route 404',()=>call('/nope'),404],
  ];
  let fail=0;
  for(const [n,f,exp] of T){const [s,d]=await f(); const ok=s===exp; if(!ok)fail++; console.log(ok?'PASS':'FAIL',n,s,JSON.stringify(d).slice(0,80));}
  srv.close(); process.exit(fail?1:0);
});
