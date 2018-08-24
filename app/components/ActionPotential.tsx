import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Point } from '../utils/geometry'
import { ExciteNeuron } from '../actions/network'
import * as _ from 'lodash'
const d3 = require('d3')

export interface IProps {
    callback: Function,
    type: string, // inhib / excit
    start: Point,
    stop: Point,
    speed: number,
    length: number
}

export interface IState {
    readonly id: string
}

export class ActionPotential extends React.Component<IProps,IState> {
    props: IProps
    state: IState = {id: _.uniqueId('ap')}

    componentDidMount () {
        this.renderD3()
    }

    render() {
        const {
            type,
            start,
        } = this.props

        const {
            id
        } = this.state

        return (
            <g>
                <circle
                    id={id}
                    cx={start.x} cy={start.y}
                    r={5}
                    fill='white'
                />
            </g>
        )
    }

    renderD3() {
        const {
            callback,
            stop,
            speed,
            length
        } = this.props

        const {
            id
        } = this.state

        console.log('ap transition')

        const transitionSetter = d3.transition()
            .duration(length / speed)
            .ease(d3.easeLinear)
            // DONT DELETE THIS
            // might be useful
            // .attrTween("transform", translateAlong(linePath.node()))
            .on("end", callback)

        const transition = d3.select("#"+id)
            .transition(transitionSetter)
            .attr("cx", stop.x)
            .attr("cy", stop.y)
            .remove()
    }
}