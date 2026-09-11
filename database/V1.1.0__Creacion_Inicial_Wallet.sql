CREATE DATABASE Wallet;


GO
USE Wallet;

CREATE TABLE document_types (
    id   INT          IDENTITY (1, 1) PRIMARY KEY,
    code VARCHAR (10) UNIQUE NOT NULL,
    name VARCHAR (50) NOT NULL
);

INSERT  INTO document_types (
    code,
    name
)
VALUES                     ('DNI', 'Documento Nacional de Identidad'),
('PAS', 'Pasaporte');


GO
CREATE TABLE Users (
    id               INT            IDENTITY (1, 1) PRIMARY KEY,
    name             NVARCHAR (50)  NOT NULL,
    lastname         NVARCHAR (50) ,
    document_type_id INT            NOT NULL,
    document_number  VARCHAR (30)   NOT NULL,
    email            NVARCHAR (250) UNIQUE,
    CONSTRAINT UQ_TypeOfId_UserId UNIQUE (document_type_id, document_number),
    CONSTRAINT FK_Users_DocumentTypes FOREIGN KEY (document_type_id) REFERENCES document_types (id)
);


GO
CREATE TABLE Accounts (
    id INT IDENTITY (1, 1) PRIMARY KEY
);


GO
CREATE TABLE Transactions (
    id        INT IDENTITY (1, 1) PRIMARY KEY,
    AccountId INT NOT NULL,
    CONSTRAINT FK_Transactions_Accounts FOREIGN KEY (AccountId) REFERENCES Accounts (id)
);


GO
ALTER TABLE Users
    ADD password_hash       NVARCHAR (MAX) NULL,
        IsActive            BIT            DEFAULT 1 NOT NULL,
        DebeCambiarPassword BIT            DEFAULT 0 NOT NULL,
        Rol                 NVARCHAR (50)  DEFAULT 'Usuario' NOT NULL;

