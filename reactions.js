import main from './src/main';

const args = process.argv.slice(2);
const link = args[0];

main(link).then((result) => {
  console.log(result);
});