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

USE WALLET;

SELECT *
FROM   Accounts
WHERE  Id = 1002;

SELECT *
FROM   AspNetUsers;

SELECT *
FROM   Transactions;

-- Inserta una transferencia donde la Cuenta 1 le envía 1500 a la Cuenta 2
INSERT  INTO Transactions (
    SenderAccountId,
    ReceiverAccountId,
    Amount,
    Date
)
VALUES                   (1, 2, 1500.00, GETUTCDATE());

INSERT  INTO Accounts (
    Id,
    UserId,
    Balance,
    Currency,
    Alias,
    Cvu,
    CreatedAt
)
VALUES               (3, 2, 0.00, 'ARS', 'usuario2.alias', '0000003100000000000002', GETDATE());

INSERT  INTO Transactions (
    SenderAccountId,
    ReceiverAccountId,
    Amount,
    Date
)
VALUES                   (1, 2, 1500.50, GETDATE()),
(2, 1, 350.00, DATEADD(minute, -30, GETDATE())),
(1, 3, 120.75, DATEADD(hour, -2, GETDATE())),
(3, 1, 5000.00, DATEADD(hour, -5, GETDATE())),
(2, 3, 450.20, DATEADD(day, -1, GETDATE())),
(3, 2, 89.99, DATEADD(day, -1, GETDATE())),
(1, 2, 2300.00, DATEADD(day, -2, GETDATE())),
(2, 1, 150.00, DATEADD(day, -2, GETDATE())),
(3, 1, 750.50, DATEADD(day, -3, GETDATE())),
(1, 3, 300.00, DATEADD(day, -3, GETDATE())),
(2, 3, 1200.00, DATEADD(day, -4, GETDATE())),
(3, 2, 65.00, DATEADD(day, -4, GETDATE())),
(1, 2, 430.25, DATEADD(day, -5, GETDATE())),
(2, 1, 920.00, DATEADD(day, -5, GETDATE())),
(3, 1, 110.00, DATEADD(day, -6, GETDATE())),
(1, 3, 2500.00, DATEADD(day, -6, GETDATE())),
(2, 3, 400.00, DATEADD(day, -7, GETDATE())),
(3, 2, 75.50, DATEADD(day, -7, GETDATE())),
(1, 2, 1800.00, DATEADD(day, -8, GETDATE())),
(2, 1, 95.00, DATEADD(day, -8, GETDATE()));

USE Wallet;


GO
ALTER TABLE Transactions
    ADD CreatedAt DATETIME2 DEFAULT GETUTCDATE() NOT NULL;

ALTER TABLE Transactions
    ADD Description NVARCHAR (MAX) NULL;

ALTER TABLE Transactions
    ADD Type NVARCHAR (MAX) NULL;