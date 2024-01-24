// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

interface Props {
  value: any
  setValue: (data: any) => void
}

const RichTextEditor = (props: Props) => {
  // ** State

  return (
    <ReactDraftWysiwyg
      editorState={props.value}
      onEditorStateChange={data => props.setValue(data)}
      toolbar={{
        options: ['inline', 'list', 'link'],
        inline: {
          options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript']
        },
        list: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true }
      }}
    />
  )
}

export default RichTextEditor
