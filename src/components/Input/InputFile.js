import React, { PureComponent } from 'react';
import './Input.scss';

class InputFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      isDragging: false
    };
    this.inputFile = React.createRef();
    this.dropArea = React.createRef();
  }

  componentDidMount() {
    const dropArea = this.dropArea.current;
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults);
      document.body.addEventListener(eventName, preventDefaults);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, () => {
        this.setState({
          isDragging: true
        });
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, () => {
        this.setState({
          isDragging: false
        });
      });
    });

    // Handle dropped files
    dropArea.addEventListener('drop', (e) => {
      var files = e.dataTransfer.files;
      this.handleFile(files[0]);
    });
  }

  onChange = (e) => {
    const file = e.target.files[0];
    this.handleFile(file);
  };

  handleFile = (file) => {
    if (file) {
      this.setState({
        fileName: file.name
      });
      this.props.onChange(file);
    }
  };

  render() {
    const { fileName, isDragging } = this.state;
    const {
      disabled,
      types,
      label,
      placeHolder,
      isRequire = false,
      uploading,
      uploaded,
      uploadSuccess,
      hideDragArea = false
    } = this.props;

    return (
      <div className="input-wrapper">
        {label && (
          <label className="input-label">
            {label}
            {isRequire && <span className="input-require">&nbsp;*</span>}
          </label>
        )}
        <div className="input-file-wrapper">
          <input
            type="file"
            style={{ display: 'none' }}
            accept={types.join(',')}
            ref={(node) => (this.inputFile = node)}
            onChange={this.onChange}
          />
          <div
            style={{ display: hideDragArea ? 'none' : '' }}
            className={`input-file-name ${isDragging ? 'drop-highlight' : ''}`}
            ref={this.dropArea}
            title={fileName ? fileName : ''}
          >
            {fileName ? fileName : placeHolder ? placeHolder : 'Drag a file here...'}
          </div>
          <span
            className="input-file-browse"
            disabled={disabled}
            onClick={() => {
              this.inputFile.click();
            }}
            title=""
          >
            <i className="far fa-file"></i> Browse
          </span>
          <span className="input-file-status">
            {uploading && (
              <span className="uploading">
                {/* <span className="uploading-icon"></span> */}
                <i className="fas fa-fan fa-spin"></i> Uploading...
              </span>
            )}
            {!uploading && uploaded && uploadSuccess && (
              <span className="upload-success">
                <i className="far fa-check-circle"></i> Succeeced
              </span>
            )}
            {!uploading && uploaded && !uploadSuccess && (
              <span className="upload-fail">
                <i className="far fa-times-circle"></i> Failed
              </span>
            )}
          </span>
        </div>
      </div>
    );
  }
}

export default InputFile;
