
import "./SignUpPage.css"
import SignUpForm from "../../components/SignUpForm/SignUpForm"
import LoginForm from "../../components/LoginForm/LoginForm"

export default function SignUpPage() {
  return (
    <div className="SignUpPage">
      <SignUpForm />
      <LoginForm/>
    </div>
  )
}