import React , { Component } from 'react'
import styled from 'styled-components'
import { filterSection } from '../../global-styles/Mixins'
import { LocationAuto } from './locationAuto'
export default class Located extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        console.log(this.props)
        return(
            <LocatedDiv> 
                 <h1>Located</h1>
                    <label className="container">
                        <input type="checkbox"/>within
                        <input type="number" step="5" placeholder="5" /> miles of
                        <LocationAuto />
                        <span className="checkmark"></span>
                    </label>
            </LocatedDiv>
        )
    }
}

const LocatedDiv = styled.div`
    ${filterSection()}
`