terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.46.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "app-server" {
  image  = "ubuntu-22-04-x64"
  name   = "app-server"
  region = "nyc1"
  size   = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.my_key.id]
}

resource "digitalocean_ssh_key" "my_key" {
  name       = "my-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

output "droplet_ip" {
  value = digitalocean_droplet.app-server.ipv4_address
}
