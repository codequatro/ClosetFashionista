-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Adds db link module for auto db create script
-- possibly redundant, due to dif db name in heroku
--
-- ---
-- CREATE EXTENSION dblink;
-- DO
-- $do$
-- BEGIN

-- IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'closet') THEN
--    RAISE NOTICE 'Database already exists';
-- ELSE
--    PERFORM dblink_exec('dbname=' || current_database()  -- current db
--                      , 'CREATE DATABASE closet');
-- END IF;

-- END
-- $do$
-- ---
-- Table 'User'
--
-- ---

DROP TABLE IF EXISTS User;

CREATE TABLE users (
  user_id SERIAL,
  username varchar(30),
  password varchar(30),
  PRIMARY KEY (user_id)
);

-- ---
-- Table 'Votes'
--
-- ---

DROP TABLE IF EXISTS votes;

CREATE TABLE votes (
  user_id INTEGER,
  image_id INTEGER,
  vote INTEGER,
  PRIMARY KEY (user_id, image_id)
);

-- ---
-- Table 'image'
--
-- ---

DROP TABLE IF EXISTS images;

CREATE TABLE images (
  image_id SERIAL,
  user_id INTEGER,
  image_name varchar(300),
  type_id INTEGER,
  PRIMARY KEY (image_id)
);

-- ---
-- Table 'clothing_types'
--
-- ---

DROP TABLE IF EXISTS `clothing_types`;

CREATE TABLE clothing_types (
  type_id serial,
  description varchar(200),
  PRIMARY KEY (type_id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE votes ADD FOREIGN KEY (user_id) REFERENCES users (user_id);
ALTER TABLE votes ADD FOREIGN KEY (image_id) REFERENCES images (image_id);
ALTER TABLE images ADD FOREIGN KEY (user_id) REFERENCES users (user_id);
ALTER TABLE images ADD FOREIGN KEY (type_id) REFERENCES clothing_types (type_id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `User` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Votes` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `image` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `clothing_types` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO users (user_id,username,password) VALUES
-- ('','','');
-- INSERT INTO Votes (user_id,image_id,vote) VALUES
-- ('','','');
-- INSERT INTO image (image_id,user_id,image,type_id) VALUES
-- ('','','','');
-- INSERT INTO clothing_types (type_id,description) VALUES
-- ('','');
insert into users (username, password) values ('me', '123');
-- INSERT INTO users (user_id,username,password) VALUES
-- ('','','');
INSERT INTO Votes (user_id,image_id,vote) VALUES
('','','');
INSERT INTO image (image_id,user_id,image,type_id) VALUES
('','','','');
INSERT INTO clothing_types (type_id,description) VALUES
('','');
