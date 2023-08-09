import React, { useState } from 'react';
import {
  FormContainer,
  FormTitle,
  FormSubTitle,
  FormDivider,
  FormLabel,
  FormInput,
  FormSubmit,
} from '../../utils/Form.styled';
import FormDropDownList from './components/FormDropDownList';
import FormCheckbox from './components/FormCheckbox';
import { UploadVideo, getVideoSubjects } from '../../services/UploadService';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';

function Upload() {
  const [options, setOptions] = useState();
  const [titleName, setTitleName] = useState('');
  const [subjectName, setSubjectName] = useState();
  const [link, setLink] = useState();
  const [useOriginalTitle, setUseOriginalTitle] = useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const dataFetch = async () => {
      const data = await getVideoSubjects();
      // set state when the data received
      data.topics.push('other');
      setOptions(data.topics);
      setSubjectName(data.topics[0]);
    };
    dataFetch();
  }, []);

  function onSubmit() {
    UploadVideo(titleName, link, subjectName, useOriginalTitle);
    console.log(
      `title: ${titleName}\nsubject: ${subjectName}\nyt-link: ${link}\nytTitle: ${useOriginalTitle}`
    );
    handleClick();
  }
  const changeSubject = (value) => setSubjectName(value);
  const ytTitle = (value) => setUseOriginalTitle(value);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <FormContainer>
        <FormTitle>Submit A Video</FormTitle>
        <FormSubTitle>Submit your video for evaluation</FormSubTitle>
        <FormDivider />
        <FormLabel>Subject</FormLabel>
        {options && (
          <FormDropDownList options={options} onOptionChange={changeSubject} />
        )}
        <FormLabel>Title</FormLabel>
        <FormInput
          onChange={(e) => setTitleName(e.target.value)}
          disabled={useOriginalTitle}
        />
        <FormCheckbox onStateChange={ytTitle}>
          use youtube link title
        </FormCheckbox>
        <FormLabel>Youtube Video Link</FormLabel>
        <FormInput
          className='large'
          onChange={(e) => setLink(e.target.value)}
        />
        <FormSubmit onClick={onSubmit}>Submit</FormSubmit>
        <Snackbar
          open={open}
          autoHideDuration={2500}
          onClose={handleClose}
          style={{ marginBottom: '3.5rem' }}
        >
          <Alert severity='info' variant='standard'>
            Your Video Is Being Uploaded
          </Alert>
        </Snackbar>
      </FormContainer>
    </>
  );
}

export default Upload;
