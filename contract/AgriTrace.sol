// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgriProduceTrace {

    enum Role { None, Farmer, Distributor, Retailer, Consumer }
    enum ProduceStatus { Harvested, InTransit, AtRetail, Sold }

    struct Produce {
        string name;
        string originFarm;
        string grade;
        uint256 harvestTime;
        address currentOwner;
        uint256 currentPrice;
        ProduceStatus status;
        address[] trace; // Ownership trace
        string[] imageURIs; // Array of image (pic) URIs
    }

    uint256 public produceCount;

    mapping(address => Role) public userRoles;
    mapping(uint256 => Produce) public produces;
    mapping(uint256 => mapping(address => bool)) public approvals;
    mapping(address => uint256[]) public myProduceIds;

    event RegisteredUser(address indexed user, Role indexed role);
    event ProduceRegistered(
        uint256 indexed produceId, 
        string name, 
        address indexed owner, 
        string originFarm, 
        uint256 price,
        string[] imageURIs
    );
    event ProduceTransferred(uint256 indexed produceId, address from, address to, uint256 price, ProduceStatus status);
    event RoleChanged(address indexed user, Role indexed newRole);
    event ProduceImagesAdded(uint256 indexed produceId, string[] newURIs);

    modifier onlyRole(Role role) {
        require(userRoles[msg.sender] == role, "You don't have the required role");
        _;
    }

    modifier onlyProduceOwner(uint256 _produceId) {
        require(produces[_produceId].currentOwner == msg.sender, "Not owner of this produce");
        _;
    }

    function registerUser(Role role) external {
        require(role != Role.None, "Invalid role");
        userRoles[msg.sender] = role;
        emit RegisteredUser(msg.sender, role);
    }

    function changeUserRole(address user, Role newRole) external {
        userRoles[user] = newRole;
        emit RoleChanged(user, newRole);
    }

    /// Register produce with as many images as you want: pass an array of full URLs ([ "ipfs://...", "ipfs://...", ... ])
    function registerProduce(
        string calldata name,
        string calldata originFarm,
        string calldata grade,
        uint256 price,
        string[] calldata imageURIs
    ) external onlyRole(Role.Farmer) {
        produceCount++;
        address[] memory path;
        produces[produceCount] = Produce({
            name: name,
            originFarm: originFarm,
            grade: grade,
            harvestTime: block.timestamp,
            currentOwner: msg.sender,
            currentPrice: price,
            status: ProduceStatus.Harvested,
            trace: path,
            imageURIs: imageURIs
        });
        myProduceIds[msg.sender].push(produceCount);
        emit ProduceRegistered(produceCount, name, msg.sender, originFarm, price, imageURIs);
    }

    function requestTransfer(uint256 produceId, address to) external onlyProduceOwner(produceId) {
        require(userRoles[to] != Role.None, "Recipient must be registered");
        approvals[produceId][to] = true;
    }

    function claimProduce(uint256 produceId, uint256 newPrice, ProduceStatus newStatus) external {
        require(approvals[produceId][msg.sender], "Not approved to receive");
        Produce storage prod = produces[produceId];
        address previousOwner = prod.currentOwner;
        prod.currentOwner = msg.sender;
        prod.currentPrice = newPrice;
        prod.status = newStatus;
        prod.trace.push(msg.sender);
        myProduceIds[msg.sender].push(produceId);
        approvals[produceId][msg.sender] = false;

        emit ProduceTransferred(produceId, previousOwner, msg.sender, newPrice, newStatus);
    }

    // Add more images to a produce after creation (e.g., at different supply chain stages)
    function addProduceImages(uint256 produceId, string[] calldata newURIs) external onlyProduceOwner(produceId) {
        for (uint i = 0; i < newURIs.length; i++) {
            produces[produceId].imageURIs.push(newURIs[i]);
        }
        emit ProduceImagesAdded(produceId, newURIs);
    }

    function traceProduce(uint256 produceId) external view returns (
        string memory name,
        string memory originFarm,
        string memory grade,
        uint256 harvestTime,
        address currentOwner,
        uint256 currentPrice,
        ProduceStatus status,
        address[] memory path,
        string[] memory imageURIs
    ) {
        Produce storage prod = produces[produceId];
        return (
            prod.name,
            prod.originFarm,
            prod.grade,
            prod.harvestTime,
            prod.currentOwner,
            prod.currentPrice,
            prod.status,
            prod.trace,
            prod.imageURIs
        );
    }

    function myProduce() external view returns (uint256[] memory) {
        return myProduceIds[msg.sender];
    }

    function getStatus(uint256 produceId) external view returns (string memory) {
        ProduceStatus s = produces[produceId].status;
        if (s == ProduceStatus.Harvested) return "Harvested";
        if (s == ProduceStatus.InTransit) return "InTransit";
        if (s == ProduceStatus.AtRetail) return "AtRetail";
        if (s == ProduceStatus.Sold) return "Sold";
        return "Unknown";
    }
}