import React, { useState } from 'react';
// import './customerGroup.scss'
import Customer from '../Customer/Customer';
import SmsModal from '../SmsModal/SmsModal';



export default function CustomerGroup(props) {
    const [showButtons, setShowButtons] = useState(false);
    const [openSmsModal, setOpenSmsModal] = useState(false);

    const sendPriceSMS = (customerGroup) => {
        const messageArray = [`Hej, vi har nu kollat över era cyklar och här är vad vi rekommenderar att göra. Om allt är ok med er så kommer vi påbörja arbetet och återkomma när den är klar. Betalning sker när cyklarna är redo att hämtas.%0A%0AAtt göra/byta:%0A%0A`];
        const CGTotalPrice = [0];

        customerGroup.forEach((customer, index) => {
            console.log(customer);
            // Get marked parts with quantity
            const thingsToFix = customer.parts.map(mp => {
                const part = props.parts.find(p => p._id === mp._id);
                if (!part) return null;
                const changedPrice = customer.partPrices.find(_part => _part.id === part._id);
                return {
                    ...part,
                    price: changedPrice ? parseInt(changedPrice.price) : part.price,
                    quantity: mp.quantity
                };
            }).filter(Boolean);

            const totalPrice = thingsToFix.reduce((total, part) => total + part.price * part.quantity, 0);

            const thingsToFixFormated = thingsToFix.map(part => {
                return "x" + part.quantity + " " + part.name + " " + (part.price * part.quantity) + "kr";
            }).join(', ');

            CGTotalPrice.push(totalPrice);
            console.log(customer);
            const message = `Cykel ${customer.bikeDescription}: ${thingsToFixFormated}%0A%0ATotalpris delar: ${totalPrice}kr%0A%0A%0A`;
            messageArray.push(message);
        });

        console.log(CGTotalPrice);

        messageArray.push(`Totalpris ${CGTotalPrice.reduce((a, b) => a + b, 0)}kr%0A%0A%0A/Felix Cykelmeck`)

        window.open(`sms:${(customerGroup[0].phone)}?body=${messageArray.join("")}`)

        props.setAlert({
            show: true,
            message: `prisförslag skickad`,
            type: "task"
        })
    }

    const sendDoneSMS = (locks, customerGroup) => {
        const locksToUse = locks.map((lock, index) => {
            const formattedLock = `${customerGroup[index].bikeDescription} - kod ${lock.lock}`;
            return formattedLock;
        });

        console.log(locksToUse);

        const messageArray = [`Hej, cyklarna är nu redo att hämtas. Totalpris för cyklarna:%0A%0A`];



        const CGTotalPrice = [0];

        customerGroup.forEach((customer, index) => {
            console.log(customer);
            // Get marked parts with quantity
            const thingsToFix = customer.parts.map(mp => {
                const part = props.parts.find(p => p._id === mp._id);
                if (!part) return null;
                const changedPrice = customer.partPrices.find(_part => _part.id === part._id);
                return {
                    ...part,
                    price: changedPrice ? parseInt(changedPrice.price) : part.price,
                    quantity: mp.quantity
                };
            }).filter(Boolean);

            const totalPrice = thingsToFix.reduce((total, part) => total + part.price * part.quantity, 0);

            CGTotalPrice.push(totalPrice);
            console.log(customer);
            const message = `Cykel ${customer.bikeDescription}: Totalpris ${totalPrice}kr%0A%0A`;
            messageArray.push(message);
        });

        console.log(CGTotalPrice);

        messageArray.push(`Totalpris alla cyklar: ${CGTotalPrice.reduce((a, b) => a + b, 0)}kr%0A%0A`);

        if (locks.filter(lock => lock.lock && lock.lock !== "nothing").length === 0) {
            messageArray.push(`Om du swishar till 1233740875 så ställer vi ut cyklarna bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 %0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0A%0AFelix Cykelmeck`);
        } else {
            messageArray.push(`Om du swishar till 1233740875 så ställer vi ut cyklarna bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 Koden till låsen är:%0A%0A${locksToUse.join("%0A")}%0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0AAlla reparationer kommer med 1 månads garanti, så har ni några problem tveka inte att höra av er.%0A%0A%0AFelix Cykelmeck`)
        }


        const message = messageArray.join("");


        window.open(`sms:${(customerGroup[0].phone)}?body=${message}`)

        props.setAlert({
            show: true,
            message: `Klart besked skickad`,
            type: "task"
        })
    }

    return (
        <div className="customer-connection" key={props.idx}>
            <div className="customer-group-top">
                <h3>{props.customerGroup[0].name} {props.customerGroup.map(customer => customer.bikeNumber).join(", ")}</h3>
                <span className='buttons-menu' onClick={() => setShowButtons(!showButtons)}>{showButtons ? <ion-icon name="close"></ion-icon> : <ion-icon name="ellipsis-horizontal"></ion-icon>}</span>
            </div>
            {showButtons && (
                <div className="buttons-dropdown">
                    <button className='primary-button' onClick={() => { setOpenSmsModal(true) }}>SMS</button>
                    <button className='primary-button' onClick={() => archiveCustomer(props.customerGroup)}>Arkivera</button>
                    {openSmsModal &&
                        <SmsModal customerGroup={props.customerGroup} sendPriceSMS={sendPriceSMS} sendDoneSMS={sendDoneSMS} closeModal={() => { setOpenSmsModal(false) }} />
                    }
                </div>
            )}
            {props.customerGroup.map(customer => (
                <Customer key={customer._id} customer={customer} parts={props.parts} allParts={props.parts} update={props.update} authenticate={() => { props.authenticate() }} setAlert={props.setAlert} nonConnectedCustomers={props.nonConnectedCustomers} customers={props.customers} connectedCustomerList={props.connectedCustomerList} />
            ))}
        </div>
    )
}