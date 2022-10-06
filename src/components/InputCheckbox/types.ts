import { FunctionComponent } from "react"

type InputCheckboxProps = {
  id: string | number
  checked?: boolean
  onChange: (checked: boolean) => void
}

export type InputCheckboxComponent = FunctionComponent<InputCheckboxProps>
