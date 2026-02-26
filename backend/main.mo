import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";



actor {
  public type ItemId = Nat;
  public type UserId = Principal;

  public type Login = {
    username : Text;
    password : Text;
    url : ?Text;
    notes : ?Text;
  };

  public type CreditCard = {
    cardNumber : Text;
    cardholderName : Text;
    expiryDate : Text;
    cvv : Text;
    billingAddress : ?Text;
  };

  public type SecureNote = {
    title : Text;
    content : Text;
  };

  public type Identity = {
    name : Text;
    email : Text;
    address : ?Text;
    phone : ?Text;
  };

  public type VaultData = {
    logins : [(ItemId, Login)];
    creditCards : [(ItemId, CreditCard)];
    secureNotes : [(ItemId, SecureNote)];
    identities : [(ItemId, Identity)];
  };

  // Persistent storage for user Vaults
  var userVaults : Map.Map<UserId, Vault> = Map.empty<UserId, Vault>();

  // Vault containing all items & next item id per user
  type Vault = {
    var logins : Map.Map<ItemId, Login>;
    var creditCards : Map.Map<ItemId, CreditCard>;
    var secureNotes : Map.Map<ItemId, SecureNote>;
    var identities : Map.Map<ItemId, Identity>;
    var nextItemId : ItemId;
  };

  func getOrCreateVault(userId : UserId) : Vault {
    switch (userVaults.get(userId)) {
      case (?vault) { vault };
      case (null) {
        let newVault = {
          var logins = Map.empty<ItemId, Login>();
          var creditCards = Map.empty<ItemId, CreditCard>();
          var secureNotes = Map.empty<ItemId, SecureNote>();
          var identities = Map.empty<ItemId, Identity>();
          var nextItemId = 0;
        };
        userVaults.add(userId, newVault);
        newVault;
      };
    };
  };

  // Login CRUD
  public shared ({ caller }) func createLogin(login : Login) : async ItemId {
    let vault = getOrCreateVault(caller);
    let id = vault.nextItemId;
    vault.logins.add(id, login);
    vault.nextItemId += 1;
    id;
  };

  public shared ({ caller }) func getLogins() : async [(ItemId, Login)] {
    let vault = userVaults.get(caller);
    switch (vault) {
      case (?v) {
        v.logins.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateLogin(id : ItemId, updated : Login) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.logins.containsKey(id)) {
      vault.logins.add(id, updated);
    } else {
      Runtime.trap("Login not found");
    };
  };

  public shared ({ caller }) func deleteLogin(id : ItemId) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.logins.containsKey(id)) {
      vault.logins.remove(id);
    } else {
      Runtime.trap("Login not found");
    };
  };

  // CreditCard CRUD
  public shared ({ caller }) func createCreditCard(card : CreditCard) : async ItemId {
    let vault = getOrCreateVault(caller);
    let id = vault.nextItemId;
    vault.creditCards.add(id, card);
    vault.nextItemId += 1;
    id;
  };

  public shared ({ caller }) func getCreditCards() : async [(ItemId, CreditCard)] {
    let vault = userVaults.get(caller);
    switch (vault) {
      case (?v) {
        v.creditCards.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateCreditCard(id : ItemId, updated : CreditCard) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.creditCards.containsKey(id)) {
      vault.creditCards.add(id, updated);
    } else {
      Runtime.trap("Credit card not found");
    };
  };

  public shared ({ caller }) func deleteCreditCard(id : ItemId) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.creditCards.containsKey(id)) {
      vault.creditCards.remove(id);
    } else {
      Runtime.trap("Credit card not found");
    };
  };

  // SecureNote CRUD
  public shared ({ caller }) func createSecureNote(note : SecureNote) : async ItemId {
    let vault = getOrCreateVault(caller);
    let id = vault.nextItemId;
    vault.secureNotes.add(id, note);
    vault.nextItemId += 1;
    id;
  };

  public shared ({ caller }) func getSecureNotes() : async [(ItemId, SecureNote)] {
    let vault = userVaults.get(caller);
    switch (vault) {
      case (?v) {
        v.secureNotes.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateSecureNote(id : ItemId, updated : SecureNote) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.secureNotes.containsKey(id)) {
      vault.secureNotes.add(id, updated);
    } else {
      Runtime.trap("Secure note not found");
    };
  };

  public shared ({ caller }) func deleteSecureNote(id : ItemId) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.secureNotes.containsKey(id)) {
      vault.secureNotes.remove(id);
    } else {
      Runtime.trap("Secure note not found");
    };
  };

  // Identity CRUD
  public shared ({ caller }) func createIdentity(identity : Identity) : async ItemId {
    let vault = getOrCreateVault(caller);
    let id = vault.nextItemId;
    vault.identities.add(id, identity);
    vault.nextItemId += 1;
    id;
  };

  public shared ({ caller }) func getIdentities() : async [(ItemId, Identity)] {
    let vault = userVaults.get(caller);
    switch (vault) {
      case (?v) {
        v.identities.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateIdentity(id : ItemId, updated : Identity) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.identities.containsKey(id)) {
      vault.identities.add(id, updated);
    } else {
      Runtime.trap("Identity not found");
    };
  };

  public shared ({ caller }) func deleteIdentity(id : ItemId) : async () {
    let vault = getOrCreateVault(caller);
    if (vault.identities.containsKey(id)) {
      vault.identities.remove(id);
    } else {
      Runtime.trap("Identity not found");
    };
  };

  public shared ({ caller }) func getAllVaultItems() : async VaultData {
    switch (userVaults.get(caller)) {
      case (?vault) {
        {
          logins = vault.logins.toArray();
          creditCards = vault.creditCards.toArray();
          secureNotes = vault.secureNotes.toArray();
          identities = vault.identities.toArray();
        };
      };
      case (null) {
        Runtime.trap("No items found");
      };
    };
  };
};
