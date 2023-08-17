import './buttons.css'

function CustomButton({ buttonName, buttonFunction }) {

    /*     const [isActive, setIsActive] = useState(false)
    
        const toggler = () => {
            setIsActive(prevState => !prevState)
        }
     */
        return (
            <button className='custombutton' id={buttonName} onClick={buttonFunction}>
                {buttonName} 
            </button>
        )
    }

export default CustomButton;