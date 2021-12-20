
Create database coderhouse;

create table productos (
 id int not null,
 title varchar(64),
 price float,
 thumbnail varchar(200)
 primary key(id)
);