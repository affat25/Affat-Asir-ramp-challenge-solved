import { FunctionComponent} from "react"

type ViewMoreProps = {
    empId: number
    onClick: React.MouseEventHandler<HTMLButtonElement>
    disabled: boolean
}
export type ViewMoreComponent = FunctionComponent<ViewMoreProps>
