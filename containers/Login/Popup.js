import React from "react"

import Form from "./Form"

const Popup = (props) => {
    return (
        <div className="modal fade" id="loginpop">
            <div className="modal-dialog modal-md modal-dialog-centered modal-lg popupDesign">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="loginRgtrBox loginRgtrBoxPopup loginRgtrBoxPopupForm">
                            <button type="button" className="close btn-close" data-bs-dismiss="modal">&times;</button>
                            <Form {...props} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Popup