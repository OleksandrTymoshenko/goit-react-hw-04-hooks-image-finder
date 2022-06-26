import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';


const modalRoot = document.querySelector('#modal-root');

function Modal({ largeImage, onClose }) {
   
  const handleClose = (e) => {
    console.log(e.code)
    if (e.key === 'q') {
      onClose();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleClose);
    return () => {
      window.removeEventListener('keydown', handleClose);
    }
  }, [])



    return createPortal(
      <div className={styles.Overlay}>
        <img className={styles.Modal} src={largeImage} width="500"  alt="Pages" />
      </div>,
      modalRoot
    );
  
}

Modal.propTypes = {
  onClose: PropTypes.func,
};

export default Modal;