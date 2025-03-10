import React from 'react'

type TitleVariant = "header" | "subheader";

interface TitleProps {
    name:string
    variant?:TitleVariant 
    color?:string
}
const MyTitle:React.FC<TitleProps> = ({name, variant='header', color}) => {
    return getTitle(name, variant, color)
  
}

const getTitle = (name:string, variant: TitleVariant, color?:string) => {
    switch(variant){
        case 'subheader':  
            return <h2 style={{color: color}}>{name}</h2>
        default:
            return <h1 style={{color: color}}>{name}</h1>
    }

}

export default MyTitle
