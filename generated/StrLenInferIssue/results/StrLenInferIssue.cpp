#include <one.hpp>
#include <memory>
#include <fstream>
#include <vector>
#include <map>

class StrLenInferIssue {
  public:
    int test(string str) {
        return str.size();
    }

  private:
};

int main()
{
    TestClass c;
    c.testMethod();
    return 0;
}