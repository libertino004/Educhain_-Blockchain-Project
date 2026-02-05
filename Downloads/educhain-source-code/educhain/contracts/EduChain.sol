// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EduChain
 * @dev A blockchain-based certificate verification system
 * @notice This contract allows educational institutions to issue and verify digital certificates
 */

contract EduChain {
    // Struct to represent a certificate
    struct Certificate {
        string certificateId;
        address issuer;
        address recipient;
        string courseName;
        string issueDate;
        string expiryDate;
        string certificateHash;
        bool isValid;
        uint256 issuedAt;
    }

    // Struct to represent an institution
    struct Institution {
        string name;
        address institutionAddress;
        bool isVerified;
        uint256 registeredAt;
    }

    // Mapping to store certificates by their ID
    mapping(string => Certificate) public certificates;

    // Mapping to store institutions
    mapping(address => Institution) public institutions;

    // Mapping to store certificates issued by an institution
    mapping(address => string[]) public institutionCertificates;

    // Mapping to store certificates owned by a recipient
    mapping(address => string[]) public recipientCertificates;

    // Array to store all certificate IDs
    string[] public allCertificateIds;

    // Array to store all registered institutions
    address[] public registeredInstitutions;

    // Owner of the contract
    address public owner;

    // Events
    event CertificateIssued(
        string indexed certificateId,
        address indexed issuer,
        address indexed recipient,
        string courseName,
        uint256 timestamp
    );

    event CertificateRevoked(
        string indexed certificateId,
        address indexed issuer,
        uint256 timestamp
    );

    event InstitutionRegistered(
        address indexed institutionAddress,
        string name,
        uint256 timestamp
    );

    event InstitutionVerified(
        address indexed institutionAddress,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegisteredInstitution() {
        require(
            institutions[msg.sender].institutionAddress != address(0),
            "Only registered institutions can call this function"
        );
        _;
    }

    modifier onlyVerifiedInstitution() {
        require(
            institutions[msg.sender].isVerified,
            "Only verified institutions can call this function"
        );
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new educational institution
     * @param _name The name of the institution
     */
    function registerInstitution(string memory _name) public {
        require(
            institutions[msg.sender].institutionAddress == address(0),
            "Institution already registered"
        );
        require(bytes(_name).length > 0, "Institution name cannot be empty");

        institutions[msg.sender] = Institution({
            name: _name,
            institutionAddress: msg.sender,
            isVerified: false,
            registeredAt: block.timestamp
        });

        registeredInstitutions.push(msg.sender);

        emit InstitutionRegistered(msg.sender, _name, block.timestamp);
    }

    /**
     * @dev Verify an institution (only owner can do this)
     * @param _institutionAddress The address of the institution to verify
     */
    function verifyInstitution(address _institutionAddress) public onlyOwner {
        require(
            institutions[_institutionAddress].institutionAddress != address(0),
            "Institution not found"
        );
        require(
            !institutions[_institutionAddress].isVerified,
            "Institution already verified"
        );

        institutions[_institutionAddress].isVerified = true;
        emit InstitutionVerified(_institutionAddress, block.timestamp);
    }

    /**
     * @dev Issue a new certificate
     * @param _certificateId Unique identifier for the certificate
     * @param _recipient Address of the certificate recipient
     * @param _courseName Name of the course
     * @param _issueDate Date when the certificate was issued
     * @param _expiryDate Date when the certificate expires
     * @param _certificateHash Hash of the certificate document
     */
    function issueCertificate(
        string memory _certificateId,
        address _recipient,
        string memory _courseName,
        string memory _issueDate,
        string memory _expiryDate,
        string memory _certificateHash
    ) public onlyVerifiedInstitution {
        require(
            certificates[_certificateId].issuer == address(0),
            "Certificate with this ID already exists"
        );
        require(_recipient != address(0), "Invalid recipient address");
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(
            bytes(_certificateHash).length > 0,
            "Certificate hash cannot be empty"
        );

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            issuer: msg.sender,
            recipient: _recipient,
            courseName: _courseName,
            issueDate: _issueDate,
            expiryDate: _expiryDate,
            certificateHash: _certificateHash,
            isValid: true,
            issuedAt: block.timestamp
        });

        institutionCertificates[msg.sender].push(_certificateId);
        recipientCertificates[_recipient].push(_certificateId);
        allCertificateIds.push(_certificateId);

        emit CertificateIssued(
            _certificateId,
            msg.sender,
            _recipient,
            _courseName,
            block.timestamp
        );
    }

    /**
     * @dev Revoke a certificate
     * @param _certificateId The ID of the certificate to revoke
     */
    function revokeCertificate(string memory _certificateId)
        public
        onlyVerifiedInstitution
    {
        require(
            certificates[_certificateId].issuer != address(0),
            "Certificate not found"
        );
        require(
            certificates[_certificateId].issuer == msg.sender,
            "Only the issuer can revoke the certificate"
        );
        require(
            certificates[_certificateId].isValid,
            "Certificate is already revoked"
        );

        certificates[_certificateId].isValid = false;
        emit CertificateRevoked(_certificateId, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a certificate
     * @param _certificateId The ID of the certificate to verify
     * @return Certificate details if valid, otherwise reverted
     */
    function verifyCertificate(string memory _certificateId)
        public
        view
        returns (
            string memory,
            address,
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            bool,
            uint256
        )
    {
        require(
            certificates[_certificateId].issuer != address(0),
            "Certificate not found"
        );

        Certificate memory cert = certificates[_certificateId];
        return (
            cert.certificateId,
            cert.issuer,
            cert.recipient,
            cert.courseName,
            cert.issueDate,
            cert.expiryDate,
            cert.certificateHash,
            cert.isValid,
            cert.issuedAt
        );
    }

    /**
     * @dev Get all certificates issued by an institution
     * @param _institutionAddress The address of the institution
     * @return Array of certificate IDs
     */
    function getInstitutionCertificates(address _institutionAddress)
        public
        view
        returns (string[] memory)
    {
        return institutionCertificates[_institutionAddress];
    }

    /**
     * @dev Get all certificates owned by a recipient
     * @param _recipientAddress The address of the recipient
     * @return Array of certificate IDs
     */
    function getRecipientCertificates(address _recipientAddress)
        public
        view
        returns (string[] memory)
    {
        return recipientCertificates[_recipientAddress];
    }

    /**
     * @dev Get all certificates
     * @return Array of all certificate IDs
     */
    function getAllCertificates() public view returns (string[] memory) {
        return allCertificateIds;
    }

    /**
     * @dev Get institution details
     * @param _institutionAddress The address of the institution
     * @return Institution details
     */
    function getInstitution(address _institutionAddress)
        public
        view
        returns (
            string memory,
            address,
            bool,
            uint256
        )
    {
        Institution memory inst = institutions[_institutionAddress];
        return (
            inst.name,
            inst.institutionAddress,
            inst.isVerified,
            inst.registeredAt
        );
    }

    /**
     * @dev Get all registered institutions
     * @return Array of institution addresses
     */
    function getAllInstitutions() public view returns (address[] memory) {
        return registeredInstitutions;
    }

    /**
     * @dev Check if a certificate is valid
     * @param _certificateId The ID of the certificate
     * @return Boolean indicating if certificate is valid
     */
    function isCertificateValid(string memory _certificateId)
        public
        view
        returns (bool)
    {
        if (certificates[_certificateId].issuer == address(0)) {
            return false;
        }
        return certificates[_certificateId].isValid;
    }
}
