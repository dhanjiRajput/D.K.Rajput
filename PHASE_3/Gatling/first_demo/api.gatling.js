import {atOnceUsers,scenario,simulation} from '@gatling.io/core';
import {http,status} from '@gatling.io/http';

export default simulation((setup)=>{
    // Http Protocol
    const httpProtocol=http
    .baseUrl('https://quick-ai-client-two.vercel.app')
    .acceptHeader("application/json")
    .contentTypeHeader('application/json');

    //Scenario
    const myScenario=scenario("My Scenario")
    .exec(http("Get ALl api").get("/api")
    .check(status().is(200)));

    //simulation
    setup(myScenario.injectOpen(atOnceUsers(1))).protocols(httpProtocol)
});