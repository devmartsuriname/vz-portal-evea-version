import client from '@/assets/images/user/client-07.jpg'
import client4 from '@/assets/images/user/client-04.jpg'
import client5 from '@/assets/images/user/client-05.jpg'
import client3 from '@/assets/images/user/client-03.jpg'

 
type SliderDataType  =  {
    title:string,
    description:string,
    image:string,
    name:string,
    catageries :string
}

type FaqType = {
    title:string,
    description:string
}

export const sliderData : SliderDataType [] =[
    {
        title: 'Satisfied user here!',
        description: " As a satisfied user, I can confidence say that my experience with NioLand has been outstanding. The service, support, and solutions provided have...",
        image: client,
        name : 'Natasha Romanoff',
        catageries : 'Black Widow'
    },
    {
        title: "It's just incredible!",
        description: 'I am extremely delighated with the exceptional serviceprovided by NioLand. Their expert support system,efficient tools, and strategic solutions have truly...',
        image: client4,
        name : ' Jimmy Bartney',
        catageries : 'Product Manager At Picko Lab'
    },
    {
        title: ' No doubt, spend. in is the best!',
        description: "Without a doubt, Spend in stands out as the absolute best.Their exceptional quality, reliablity, and customer service are unmatched. I have complete....",
        image: client5,
        name : ' Moritika Kazuki',
        catageries : 'Finance Manager at Mangan'
    },
    {
        title: 'Best service here!',
        description: "I've tried many services, but none compare to the excellence provided here! From start to finish, the team has been attentive, professional, and committed to delivering the best results.",
        image: client3,
        name : ' Barbara McIntosh',
        catageries : 'Senior Software Developer'
    },
]

    export const faqContents: FaqType[] = [
    {
      title: 'How long does it take to ship my order ?',
      description:
        "Shipping times vary depending on your location and the shipping method chosen. Typically, orders are processed and shipped within 1-3 business days. You'll receive a tracking number once your order is shipped, which you can use to monitor its delivery status.",
    },
    {
      title: 'What payment methods do you accept ?',
      description:
        "We accept various payment methods, including credit/debit cards, PayPal, and sometimes other online payment platforms.",
    },
    {
      title: 'What shipping options do you have ?',
      description:
        'Standard Shipping: This is our regular shipping option, which typically takes 3-7 business days for delivery, depending on your location and the shipping carrier.',
    },
    {
      title: 'How do i make changes to an existing order ?',
      description:
        "International Shipping We also offer international shipping for customers outside the country. Delivery times for international orders vary widely based on destination and shipping method chosen. It typically ranges from 6-21 business days.",
    },
    {
      title: 'When will my order arrive ?',
      description:
        "Processing Time Before your order is shipped, it needs to be processed by the seller. Processing times can vary based on factors such as order volume, item availability, and any customization or personalization required. Typically, sellers aim to process orders within 1-3 business days, but this can vary.",
    },
  ]
