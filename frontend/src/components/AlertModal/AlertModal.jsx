



export default function AlertModal(props) {

  // const [alert, setAlert] = useState({
  //   show: false,
  //   message: props.message,
  //   type: props.type
  // });

  // onclose = () => {
  //   setAlert({
  //     show: false,
  //     message: '',
  //     type: ''
  //   });
  // }


  setTimeout(() => {
    props.colseAlert();
  }, 3000);

  return (
    <div className={`alert-modal ${props.type}`}>
      <div className="alert-modal-content">
        <p>{props.message}</p>
      </div>
    </div>
  )
}