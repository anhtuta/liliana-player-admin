import React, { PureComponent } from 'react';
import './Input.scss';

class InputFile extends PureComponent {
  state = {
    fileName: ''
  };
  inputFile = React.createRef();

  onChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
        fileName: file.name
      });
      this.props.onChange(file);
    }
  };

  render() {
    const { fileName } = this.state;
    const {
      disabled,
      types,
      label,
      placeHolder,
      isRequire = false,
      uploading,
      uploaded,
      uploadSuccess
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
          <div className="input-file-name">
            {fileName ? (
              fileName
            ) : (
              <span style={{ color: '#a2a2a2' }}>{placeHolder ? placeHolder : "Please upload a file..."}</span>
            )}
            <span
              className="input-file-browse"
              disabled={disabled}
              onClick={() => {
                this.inputFile.click();
              }}
            >
              <i className="far fa-file"></i> Browse
            </span>
          </div>
          <span className="input-file-status">
            {uploading && (
              <span className="uploading">
                <span className="uploading-icon"></span>Uploading...
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
