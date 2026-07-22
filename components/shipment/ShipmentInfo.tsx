interface Props{

label:string;

value?:string;

}

export default function ShipmentInfo({

label,

value,

}:Props){

return(

<div>

<p className="text-gray-500 text-sm">

{label}

</p>

<p className="font-semibold">

{value || "-"}

</p>

</div>

);

}