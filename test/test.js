const test = require("tape");
const tapSpec = require("tap-spec");
const convertCSS = require("../src/convert").convertCSS;
const normalize = require("./normalize");

test
  .createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test("element selector", function(t) {
  t.plan(1);

  t.deepEqual(
    convertCSS(`
    body {
        color: red
    }
    `, {format: 'object'}),
    { body: { color: "red" } }
  );
});

test("class and id selectors", function(t) {
  t.plan(1);

  t.deepEqual(
    convertCSS(`
      #primary {
        color: red
      }
      #secondary {
        width: 300px
      }
      .tertiary {
        border: 1px solid red
    }
      `, {format: 'object'}),
    {
      primary: { color: "red" },
      secondary: { width: "300px" },
      tertiary: { border: "1px solid red" }
    }
  );
});

test("property hyphens", function(t) {
  t.plan(1);

  t.deepEqual(
    convertCSS(`
        .main {
            font-family: "helvetics, sans-serif";
            justify-items: center;
        }
        `, {format: 'object'}),
    {
      main: { fontFamily: "helvetics, sans-serif", justifyItems: "center" }
    }
  );
});

test("pseudo selectors", function(t) {
  t.plan(1);

  t.deepEqual(
    convertCSS(`
          .link {
              color: red
          }
          .link:link,
          .link:hover,
          .link:active,
          .link:focus {
              text-decoration: none;
              padding: 12px;
          }
          .link::before {
              content: "hello world"
          }
          `, {format: 'object'}),
    {
      link: {
        "color": "red",
        ":link": {
          textDecoration: "none",
          padding: "12px"
        },
        ":hover": {
          textDecoration: "none",
          padding: "12px"
        },
        ":active": {
          textDecoration: "none",
          padding: "12px"
        },
        ":focus": {
          textDecoration: "none",
          padding: "12px"
        },
        "::before": {
          content: "hello world"
        }
      }
    }
  );
});

test("media queries", function(t) {
  t.plan(1);

  t.deepEqual(
    convertCSS(`
      @media (max-width: 600px) {
          small {
            background-color: 'red';
            padding: '10px';
          }
          .head {
            display: 'block';
          }
        }
          `, {format: 'object'}),
    {
      small: {
        "@media (max-width: 600px)": {
          backgroundColor: "red",
          padding: "10px"
        }
      },
      head: {
        "@media (max-width: 600px)": {
          display: "block"
        }
      }
    }
  );
});

test("animations", function(t) {
  t.plan(3);

  t.deepEqual(
    convertCSS(`
      @keyframes slidein {
        from {
          margin-left: 100%;
          width: 300%; 
        }
      
        to {
          margin-left: 0%;
          width: 100%;
        }
      }
      `, {format: 'object', convertAnimations: true}),
    {
      from: {
        marginLeft: "100%",
        width: "300%"
      },
      to: {
        marginLeft: "0%",
        width: "100%"
      }
    }
  );

  t.deepEqual(
    convertCSS(`
        @keyframes slidein {
          0% {
            margin-left: 100%;
            width: 300%; 
          }
        
          100% {
            margin-left: 0%;
            width: 100%;
          }
        }
        `, {format: 'object', convertAnimations: true}),
    {
      "0%": {
        marginLeft: "100%",
        width: "300%"
      },
      "100%": {
        marginLeft: "0%",
        width: "100%"
      }
    }
  );

  t.deepEqual(
    convertCSS(`
      @keyframes slidein {
        from {
          margin-left: 100%;
          width: 300%; 
        }
      }
      `, {format: 'object'}),
    {}
  );
});

test("comments", function(t) {
  t.plan(1);
  t.deepEqual(convertCSS(`/* this is a comment */`, {format: 'object'}), {});
});

test("output", function(t) {
  t.plan(3);
  t.equal(
    typeof convertCSS(`
      body {
        color: red
      }
    `), 'string');

  t.equal(
    typeof convertCSS(`
      body {
        color: red
      }
    `, {format: 'object'}), 'object');

  t.equal(
    typeof JSON.parse(convertCSS(`
      body {
        color: red
      }
    `, {format: 'json'})), 'object');  
});

test("normalize", function(t) {
  t.plan(1);
  t.doesNotThrow(() => {return convertCSS(normalize)}, {});
});
