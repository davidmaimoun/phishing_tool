import React from 'react'

type TitleVariant = "header" | "subheader";

interface TitleProps {
    name:string
    variant?:TitleVariant 
}
const MyTitle:React.FC<TitleProps> = ({name, variant='header'}) => {
    return getTitle(name, variant)
  
}

const getTitle = (name:string, variant: TitleVariant) => {
    switch(variant){
        case 'subheader':  
            return <h2>{name}</h2>
        default:
            return <h1>{name}</h1>
    }

}

export default MyTitle
