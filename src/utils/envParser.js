function getNumber(env_name, defaults) {
  let env_value = process.env[env_name];
  if (!env_value) return defaults;

  let value = parseInt(env_value, 10);
  if (isNaN(value)) return defaults;

  return value;
}

function getString(env_name, defaults) {
  let env_value = process.env[env_name];

  if (!env_value) return defaults;

  return env_value;
}

function getBoolean(env_name, defaults) {
  let env_value = process.env[env_name];
  if (!env_value) return defaults;

  env_value = env_value.toLowerCase();

  let intvalue = parseInt(env_value, 10);
  if (!isNaN(intvalue)) return Boolean(intvalue);

  if (env_value === "true") return true;
  else if (env_value === "false") return false;

  return defaults;
}

module.exports = {
  getString,
  getNumber,
  getBoolean,
};