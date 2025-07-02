import transporter from "./transporter.js";

const sendMail = async (props) => {
  const mail = await transporter.sendMail({
    from: props.from,
    to: props.to,
    subject: props.subject,
    html: props.html,
  });
};

export default sendMail;