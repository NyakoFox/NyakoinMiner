import "./NavigationBar.css"

export default function NavigationBar({ largeNumbers, setLargeNumbers }) {

    return (
        <nav>
            <a onClick={
                () => {
                    setLargeNumbers(!largeNumbers);
                }
            }>Toggle large numbers</a>
        </nav>
    )
}
