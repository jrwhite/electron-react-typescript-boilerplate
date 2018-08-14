import * as React from 'react'
import { Arc, ellipseBoundarySetter, ellipsePathSetter } from '../utils/geometry'

export interface IProps {
    major: number,
    minor: number,
    angle: number,
    arcs: Array<Arc>
}

export const Ellipse: React.SFC<IProps> = (props) => {
    const {
        major,
        minor,
        angle,
        arcs
    } = props

    return (
        <g>
            <g fill='grey'>
            <path d={ellipseBoundarySetter(major, minor, angle)} />
            </g>
            <g fill='none'>
            <path  d={ellipsePathSetter(arcs, major, minor, angle)} />
            </g>
        </g>
    )
}