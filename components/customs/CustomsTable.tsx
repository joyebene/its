import DataTable from "@/components/shared/DataTable";
import CustomsStatusBadge from "./CustomsStatusBadge";

import { Customs } from "../../lib/types";


interface Props{
    data:Customs[];
}


export default function CustomsTable({
    data
}:Props){


const columns = [

{
    key:"shipment",
    title:"Shipment",
    render:(row:Customs)=>(
        <div>
            <p className="font-medium">
                {row.shipment.trackingNumber}
            </p>

            <p className="text-xs text-slate-500">
                {row.shipment.container?.containerNumber || "-"}
            </p>
        </div>
    )
},


{
    key:"status",
    title:"Status",

    render:(row:Customs)=>(
        <CustomsStatusBadge 
            status={row.status}
        />
    )
},


{
    key:"dutyAmount",
    title:"Duty Amount",

    render:(row:Customs)=>(
        `₦${row.dutyAmount.toLocaleString()}`
    )
},


{
    key:"processedBy",
    title:"Processed By",

    render:(row:Customs)=>(
        row.processedBy?.firstName + " " + row.processedBy?.lastName || "-"
    )
},


];


return (

<DataTable

columns={columns}

data={data}

resource="customs"

/>

)

}