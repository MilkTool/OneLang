class MapX {
  set(key, value) {
  }
  
  get(key) {
    return null;
  }
}

class Main {
  test() {
    const map = new MapX();
    map.set("hello", 3);
    const numValue = map.get("hello2");
  }
}