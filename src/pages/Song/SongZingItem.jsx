import React, { useState } from 'react';
import musicIcon from '../../assets/icons/music_icon.jpg';
import './SongZingItem.scss';

/**
 * Copy styles from Song.js
 */
const SongZingItem = (props) => {
  const { title, artistsNames, thumbnailM } = props;

  return (
    <div className="song-zing-item">
      <div className="td-song-info">
        <img className="song-picture" src={thumbnailM ? thumbnailM : musicIcon} alt={title} />
        <div className="song-item">
          <div className="song-title">{title}</div>
          <div className="song-artist">{artistsNames}</div>
        </div>
      </div>
    </div>
  );
};

export default SongZingItem;
