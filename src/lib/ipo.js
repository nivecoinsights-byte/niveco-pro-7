export const getStatus=({openDate,closeDate,listingDate},now=new Date())=>{const day=new Date(now.toDateString());if(openDate&&day<new Date(openDate))return'Upcoming';if(closeDate&&day<=new Date(closeDate))return'Open';if(listingDate&&day>=new Date(listingDate))return'Listed';return'Closed'}
export const calculateApplication=(lots,lotSize,price)=>({shares:Number(lots||0)*Number(lotSize||0),amount:Number(lots||0)*Number(lotSize||0)*Number(price||0)})
export const formatCurrency=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(v||0))
