import React, { ReactNode, RefObject, useEffect, useState } from "react";

type AnimatedHeightDisplayProps = {
    faces: ReactNode[]
    active: number;
    style?: React.CSSProperties
    className?: string
}
type FaceWithRefs = {
    component: ReactNode,
    ref: RefObject<any>,
}
const AnimatedHeightDisplay: React.FC<AnimatedHeightDisplayProps> = ({faces, active, style, className}) => {
    const createFacesWithRefs = (): FaceWithRefs[] => {
        const ref = React.createRef<HTMLDivElement>()
        return faces.map(face => ({
            ref: ref,
            component: <div className={className} ref={ref}>{face}</div>,
        }))
    }
    const[facesWithRefs, setFacesWithRefs] = useState<FaceWithRefs[]>(createFacesWithRefs())
    useEffect(() => {
        setFacesWithRefs(createFacesWithRefs())
    }, [faces])


    const [currentHeight, setCurrentHeight] = useState(facesWithRefs[active].ref?.current?.scrollHeight)
    useEffect(() => {
        setCurrentHeight(facesWithRefs[active].ref?.current?.scrollHeight)
    }, [facesWithRefs,active])

    return(
        <div 
            className="height-display-container"
            style={{maxHeight: `${currentHeight}px`}}
        >
            {facesWithRefs[active].component}
            <div className="height-display-filler"></div>
        </div>
    )
}
export default AnimatedHeightDisplay
