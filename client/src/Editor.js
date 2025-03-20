import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Editor({value, onChange}){

    const modules = {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'align': [] }],
          ['link', 'image'], ['clean']
        ],
      };
      
    return(
         <ReactQuill 
         value={value}                   
         modules={modules}                  
         onChange={onChange}
                             />
    )
}