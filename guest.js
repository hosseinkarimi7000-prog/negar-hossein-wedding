(function(root){
  const generalLimit=20;
  const text=v=>String(v||'').trim().slice(0,160);
  function invitation(p){const n=Number(p.get('seats'));return {name:text(p.get('name'))||'مهمان گرامی',id:text(p.get('id'))||'general',seats:Number.isInteger(n)&&n>=1&&n<=100?n:null,tier:p.get('tier')==='aqd'?'aqd':'ceremony'};}
  function response(invite,attendance,count,extras){
    const personal=Number.isInteger(invite.seats)&&invite.seats>0;
    if(!['yes','no'].includes(attendance))throw Error('حضور یا عدم حضور را انتخاب کنید.');
    const confirmed=attendance==='no'?0:Number(count);
    if(!Number.isInteger(confirmed)||confirmed<0||(attendance==='yes'&&confirmed<1)||confirmed>(personal?invite.seats*2:generalLimit))throw Error('تعداد همراهان معتبر نیست.');
    if(extras.length!==(personal?Math.max(0,confirmed-invite.seats):0)||extras.some(p=>!text(p.name)||!text(p.relationship)))throw Error('نام و نام خانوادگی و نسبت هر همراه اضافه را کامل کنید.');
    return {guest_id:invite.id,invitation_name:invite.name,invited_count:personal?invite.seats:null,confirmed_count:confirmed,attendance,invitation_type:invite.tier,additional_guests:extras.map(p=>({name:text(p.name),relationship:text(p.relationship)}))};
  }
  const api={invitation,response,generalLimit};if(typeof module!=='undefined')module.exports=api;else root.WeddingGuests=api;
})(typeof window==='undefined'?{}:window);
