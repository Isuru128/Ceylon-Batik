package com.ceylonbatik;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.data.mongodb.uri=mongodb://localhost:27017/ceylonbatik_test",
        "spring.data.mongodb.database=ceylonbatik_test"
})
class CeylonBatikApplicationTests {

    @Test
    void contextLoads() {
    }

}
