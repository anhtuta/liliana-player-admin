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
      disabled = false,
      types,
      label,
      className = '',
      placeHolder,
      isRequire = false,
      uploading,
      uploaded,
      uploadSuccess,
      hideDragArea = false
    } = this.props;

    return (
      <div className={`input-wrapper ${className}`}>
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
            {fileName ? fileName : placeHolder ? placeHolder : 'Drag a file here'}
            <span
              className={`input-file-browse ${disabled ? 'browser-disabled' : ''}`}
              disabled={disabled}
              onClick={() => {
                if (!disabled || !disabled === true) this.inputFile.click();
              }}
              title="Browse files"
            >
              <i className="fa fa-upload"></i>
            </span>
          </div>
          {(uploading || uploaded) && (
            <span className="input-file-status">
              {uploading && (
                <span className="uploading" title="Uploading...">
                  {/* <span className="uploading-icon"></span> */}
                  <i className="fa fa-spinner fa-spin"></i> Uploading...
                </span>
              )}
              {!uploading && uploaded && uploadSuccess && (
                <span className="upload-success" title="Upload succeeded!">
                  <i className="fa fa-check-circle"></i> Succeeded
                </span>
              )}
              {!uploading && uploaded && !uploadSuccess && (
                <span className="upload-fail" title="Upload Failed!!!">
                  <i className="fa fa-times-circle"></i> Failed
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default InputFile;
