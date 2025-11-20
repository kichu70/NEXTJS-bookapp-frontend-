import axios from 'axios'
import { toast } from 'react-toastify';

export const handlePayment =async (books)=>{
        try{
            const bookArray =Array.isArray(books)? books :[books];
            const {data} =await axios.post(`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/payment/create-checkout-session`,
               {books:bookArray,}
            )
            window.location.href =data.url
        }
        catch(err){
            console.log(err);
            toast.error("Payemnt failed!")
        }
    };

