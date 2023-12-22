import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor MicroblogActor {
  public type Message = {
    text : Text;
    time : Time.Time;
    author : Principal;
  };

  public type Microblog = actor {
    follow : shared (Principal) -> async ();
    follows : shared query () -> async [Principal];
    post : shared (Text) -> async ();
    posts : shared query (Time.Time) -> async [Message];
    timeline : shared (Time.Time) -> async [Message];
    set_name : shared (Text) -> async ();
    get_name : shared query () -> async ?Text;
  };

  stable var followed : List.List<Principal> = List.nil(); //empty list
  stable var current_name : Text = "";

  public shared func follow(id : Principal) : async () {
    followed := List.push(id, followed);
  };

  public shared query func follows() : async [Principal] {
    List.toArray(followed);
  };

  stable var messages : List.List<Message> = List.nil();

  public shared func post(otp : Text, text : Text) : async () {
    assert (otp == "123456");
    let newMessage : Message = {
      text = text;
      time = Time.now();
      author = Principal.fromActor(MicroblogActor);
    };
    messages := List.push(newMessage, messages);
  };

  public shared query func posts(since : Time.Time) : async [Message] {
    var posts_since : List.List<Message> = List.nil();

    for (msg in Iter.fromList(messages)) {
      if (msg.time > since) {
        posts_since := List.push(msg, posts_since);
      };
    };

    List.toArray(posts_since);
  };

  public shared func timeline(since : Time.Time) : async [Message] {
    var all : List.List<Message> = List.nil();

    for (id in Iter.fromList(followed)) {
      let canister : Microblog = actor (Principal.toText(id));
      let msgs = await canister.posts(since);

      // merge by time in descending order
      all := List.merge(
        all,
        List.fromArray(msgs),
        func(m1 : Message, m2 : Message) : Bool {
          m1.time >= m2.time;
        },
      );
    };

    List.toArray(all);
  };

  public shared func set_name(name : Text) : async () {
    // TODO: guard by something like
    // assert (msg.caller == Principal.fromActor(MicroblogActor));
    current_name := name;
  };

  public shared func get_name() : async ?Text {
    return ?current_name;
  };

};
