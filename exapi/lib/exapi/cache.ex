defmodule Exapi.Cache do
  def write(key, value) do
    Cachex.start_link(:cache)
    Cachex.put(:main, key, value)
  end

  def read(key) do
    {:ok, value} = Cachex.fetch(:main, key)
    value
  end
end


Cachex.fetch(:cache, key, fn -> {:ignore, decoded}end)
