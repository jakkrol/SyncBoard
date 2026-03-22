import ToggleTheme from "./HeaderComps/ToggleTheme"

export default function Header(){
    return(
        <div className="fixed top-0 right-0 p-3">
            <ToggleTheme/>
        </div>
    )
}