// @ts-ignore
export default ({ error }) => {
  if (process.env.NODE_ENV === 'development') {
    if (error) {
      return (
        <p>
          {error.message}
          {error.stack}
        </p>
      );
    }
  }

  return null;
};
