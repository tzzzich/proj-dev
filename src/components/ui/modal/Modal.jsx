import './modal.css'

import CloseIcon from '../../../assets/icons/close.svg?react';

const Modal = ({ show, onClose, children }) => {
	return (
		show && (
			<div className='modal' id='modal'>
				<div className='modal-wrapper'>
					<div className='modal-content'>
						<div className='modal-header'>
							<CloseIcon className='close-icon' onClick={onClose} />
						</div>
						<div className='modal-body'>{children}</div>
						<div className='modal-footer'></div>
					</div>
				</div>
			</div>
		)
	)
}



export default Modal