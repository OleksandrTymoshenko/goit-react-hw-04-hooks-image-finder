import { useState } from 'react';
import Loader from './components/Loader/Loader';
import Searchbar from './components/Searchbar/Searchbar';
import PixabayApi from './API/pixabayApi';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Button from './components/Button/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './components/Modal/Modal';
import styles from '../src/app.module.css';
import Error from './img/photo_2022-06-26_13-35-52.jpg';

const pixabayApi = new PixabayApi();

export function App () {
  const [imgArr, setImgArr] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [largeImage, setLargeImage] = useState('')
  const [status, setStatus] = useState("idle");

 const toggleModal = () => {
    setShowModal(!showModal)
  };

 const setLargeUrl = url => {
    setLargeImage(url)
    toggleModal();
  };

  const loadMore = async (e) => {
    e.preventDefault();
    pixabayApi.incrementPage();
    setStatus('pending')
    try {
      const hits = await pixabayApi.getImagesFromApiByName();
      setImgArr((prevState) => [...prevState, ...hits])
     setStatus('resolved')
    } catch (error) {
      console.log(error)
    }
 
  };

  const onInputFormSubmit =  query => {
 
    if (query.trim() === '') {
      toast.error('введите значения для поиска');
      return;
    }
    
    setStatus('pending')
    pixabayApi.query = query;
    pixabayApi.resetPage();

    pixabayApi.getImagesFromApiByName().then((hits) => {
      if (hits.length === 0) {
        setStatus("rejected")
        return;
      }
      
   
      setImgArr([...hits])
      setStatus('resolved')
    })

      
    
  };

  return (
      
      <div className={styles.App}>
        <Searchbar onFormSubmit={onInputFormSubmit} />
      {status === "pending" || status === "resolved" ? <ImageGallery
          imgArr={imgArr}
          setLargeUrl={setLargeUrl}
        /> : null}
        {status === "resolved" && <Button loadMore={loadMore} />}
        {status === "pending" && <Loader />}
        <ToastContainer autoClose={3000} />
        {showModal && (
          <Modal
            onClose={toggleModal}
            largeImage={largeImage}
          />
      )}
      {status === "rejected" &&
        <div className={styles.error}><img src={Error} alt="Фото закончились или неверный запрос" /></div>
        }
      </div>
    );
  
}