import React from 'react'



const GlobalView = WrapperComponent =>{
    class GlobalViewComponent extends React.Component{
        
        render(){
            return (
                <div>
                    <h1>Global</h1>
                    <WrapperComponent />
                </div>
            )
        }
    }

    return GlobalViewComponent;
}

export default GlobalView