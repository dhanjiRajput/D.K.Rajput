const sum = require("./sum");
const fetchPromise = require("./sum");
const fetchData = require("./sum");
const myFunction = require("./sum")

//1
// test('Add 1 + 2 equals 3', () => {
//     expect(sum(1, 2)).toBe(3);
// })

// test('Object Assignment', () => {
//   const data={one:1};
//   data['two']=2;
//   console.log("Object Data :-",data);
  
//   expect(data).toEqual({one:1,two:2});
// })


// test('null is falsy', () => {
//   const n=null;
//   expect(n).toBeFalsy();
// })

// test('falsy values', () => {
//   expect(false).toBeFalsy();
//   expect(0).toBeFalsy();
//   expect("").toBeFalsy();
//   expect(undefined).toBeFalsy();
//   expect(null).toBeFalsy();
//   expect(NaN).toBeFalsy();
// });


//2
// test('throws on invalid input', () => {
//   expect(()=>{
//     myFunction("1");
//   }).toThrow();
// });


//3
// test('The Data is Penaut Butter',done=> {
//   function callback(data) {
//     try {
//         expect(data).toBe('Penaut Butter');
//         done();
//     } catch (error) {
//         done(error);
//     }
//   };
//   fetchData(callback);
// })

//4
// test('The Data is Penaut Butter', () => {
//     return expect(fetchPromise()).resolves.toBe('Penaut Butter');
// })

// test('The fetch fails with an error', () => {
//     return expect(fetchPromise()).rejects.toBe('error');
// })


//4 with async await
// test('The Data is Penaut Butter', async() => {
//   const data=await fetchPromise();
//   expect(data).toBe('Penaut Butter');
// })



// test('Mock Implementaion of a basic function', () => {
//   const mock=jest.fn(x=>42 + x);
//   expect(mock(1)).toBe(43);
//   expect(mock).toHaveBeenCalledWith(1);
// });

test('Styling on a method of an object', () => {
    const video={
        play(){
            return true;
        }
    }

    const spy=jest.spyOn(video,'play');
    video.play();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
})